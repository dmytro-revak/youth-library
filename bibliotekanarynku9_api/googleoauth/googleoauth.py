"""
Module that represent logic of common Google OAuth flow provider.
Contains classes and method that facilitate interaction with Google OAuth logic.
"""

from datetime import datetime, timedelta, timezone
import requests

from django.conf import settings
from google_auth_oauthlib.flow import Flow
from oauthlib.oauth2.rfc6749.errors import OAuth2Error

from googleoauth.models import GoogleOAuthSession
from utils.logger import LOGGER


CLIENT_ID = settings.GOOGLE_APPLICATION_CREDENTIALS["web"]["client_id"]
CLIENT_SECRET = settings.GOOGLE_APPLICATION_CREDENTIALS["web"]["client_secret"]
REFRESH_GRANT_TYPE = "refresh_token"
REFRESH_TOKEN_URL = "https://oauth2.googleapis.com/token"


class GoogleOAuthProvider:
    """
    Class that facilitates the common operations with the Google OAuth flow.
    Contains methods that help go though the Google Auth Code grant flow.
    """

    def __init__(self, service, scopes, redirect_url):
        self.flow = Flow.from_client_config(settings.GOOGLE_APPLICATION_CREDENTIALS, scopes=scopes)
        self.service = service
        self.scopes = scopes
        self.flow.redirect_uri = redirect_url

    @staticmethod
    def __get_expires_at_time(token_ttl: int) -> datetime:
        """
        Method that converts the accepted token TTL in seconds and returns the
        certain time when new access token will become invalid.
        """

        return datetime.now(tz=timezone.utc) + timedelta(seconds=token_ttl)

    def get_authorize_url(self):
        """
        Method that generates the valid authorization URL for
        the certain Google service.
        :return: str that represents the auth URL.
        """
        auth_url, _ = self.flow.authorization_url()
        return auth_url

    def generate_oauth_tokens(self, user, auth_code):
        """
        Method that generates the access token for the certain user using the
        accepted auth code. This method facilitates the final step of
        Auth Code grant type.
        :param user: CustomUser instance that represents the session user.
        :param auth_code: str that represents the auth code generated at previous flow step.
        :return: bool that indicates are access and refresh tokens generated.
        """
        try:
            self.flow.fetch_token(code=auth_code)
        except OAuth2Error as err:
            LOGGER.error(
                f"Exception occurs during the token fetching for user: {user}. " f"Exception: {err}"
            )
            return False

        oauth_session = GoogleOAuthSession.create(
            {
                "user": user,
                "service": self.service,
                "access_token": self.flow.credentials.token,
                "refresh_token": self.flow.credentials.refresh_token,
                "expires_at": self.flow.credentials.expiry,
            }
        )
        return bool(oauth_session)

    def get_access_token(self, user):
        """
        Method that retrieves previous generated access token from database.
        It retrieves access token for the certain user and service.
        :param user: CustomUser instance that represents the session user.
        :return: str that represents access token.
        """
        return GoogleOAuthSession.get_service_access_token_by_user(self.service, user)

    def get_refresh_token(self, user):
        """
        Method that retrieves previous generated refresh token from database.
        It retrieves refresh token for the certain user and service.
        :param user: CustomUser instance that represents the session user.
        :return: str that represents refresh token.
        """
        return GoogleOAuthSession.get_service_refresh_token_by_user(self.service, user)

    def refresh_token(self, user, refresh_token):
        """
        Method that refreshes the outdated access token for the certain user.
        :param user: CustomUser instance that represents the session user.
        :param refresh_token: str that represents the user's refresh token.
        :return: str that represents updated access token for user or None.
        """
        payload = {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": REFRESH_GRANT_TYPE,
        }
        response = requests.post(REFRESH_TOKEN_URL, data=payload)
        if not response:
            LOGGER.error(
                f"Failed request to Google Auth for refresh access token. "
                f"Cannot refresh token for user: {user}"
            )
            return ""

        data = response.json()
        refreshed_access_token, expires_at, scope = (
            data.get("access_token"),
            self.__get_expires_at_time(data.get("expires_in")),
            data.get("scope"),
        )
        if scope not in self.scopes:
            LOGGER.error(
                f"Failure during refreshing the access token for the user: {user}. "
                f"Received scope ({scope}) no match provide's scopes ({self.scopes})"
            )
            return ""

        return GoogleOAuthSession.update_service_access_token_by_user(
            self.service, user, refreshed_access_token, expires_at
        )

    def is_access_token_expired(self, user):
        """
        Method that returns status of current user access token. Shows is token
        are valid in time slot.
        """

        expire_time = GoogleOAuthSession.get_access_token_expire_time(self.service, user)
        return datetime.now(tz=timezone.utc) > expire_time
