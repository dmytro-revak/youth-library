import React from 'react';
import Divider from '@material-ui/core/Divider';
import AdminButton from '../../components/AdminButton';
import AdminTitleField from '../../components/AdminTitleField';
import AdminDescriptionField from '../../components/AdminDescriptionField';
import AdminAddLinkForm from '../../components/AdminAddLinkForm/AdminAddLinkForm';
import AdminNewsTranslationLinksList from './AdminNewsTranslationLinksList';
import {putNewsTranslationService, deleteNewsTranslationService, postNewsTranslationLinkService, putNewsTranslationLinkService, deleteNewsTranslationLinkService} from './adminNewsService';
import {getUpdatedState} from '../../helpers';

const buttonsWrapperStyle = {
    display: 'flex'
};

const buttonsStyle = {
    width: '50%',
    margin: 10
};

class AdminNewsItemTranslation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            updatedTitle: props.title,
            description: props.description,
            updatedDescription: props.description,
            isError: false,
            isAddLinkFormError: false,
            isUpdateLinkError: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(getUpdatedState({
            title: nextProps.title,
            updatedTitle: nextProps.title,
            description: nextProps.description,
            updatedDescription: nextProps.description,
        }, this.state));
    }

    haveFieldsChanged = () => {
        return !(
            this.state.title === this.state.updatedTitle &&
            this.state.description === this.state.updatedDescription
        );
    }

    handleTitleChange = newTitle => {
        this.setState(getUpdatedState({
            updatedTitle: newTitle,
        }, this.state));
    }

    handleDescriptionChange = newDescription => {
        this.setState(getUpdatedState({
            updatedDescription: newDescription,
        }, this.state));
    }

    handleSaveTranslationClick = () => {
        putNewsTranslationService(
            this.props.newsId,
            this.props.id,
            this.state.updatedTitle,
            this.state.updatedDescription
        ).then(() => {
            this.setState(getUpdatedState({
                title: this.state.updatedTitle,
                description: this.state.updatedDescription,
                isError: false
            }, this.state));
            this.props.onUpdateTranslationSuccess();
        }).catch(() => {
            this.setState(getUpdatedState({isError: true}, this.state));
        });
    }

    handleRemoveTranslationClick = () => {
        deleteNewsTranslationService(
            this.props.newsId,
            this.props.id
        ).then(() => {
            this.props.onRemoveTranslationSuccess();
        });
    }

    handleAddLinkClick = (label, href) => {
        postNewsTranslationLinkService(
            this.props.newsId,
            this.props.id,
            label,
            href
        ).then(() => {
            this.setState(getUpdatedState({
                isAddLinkFormError: false
            }, this.state));
            this.props.onAddTranslationLinkSuccess();
        }).catch(() => {
            this.setState(getUpdatedState({
                isAddLinkFormError: true
            }, this.state));
        });
    }

    handleLinkUpdateClick = (linkId, label, href) => {
        putNewsTranslationLinkService(
            this.props.newsId,
            this.props.id,
            linkId,
            label,
            href
        ).then(() => {
            this.setState(getUpdatedState({
                isUpdateLinkError: false
            }, this.state));
            this.props.onUpdateTranslationLinkSuccess();
        }).catch(() => {
            this.setState(getUpdatedState({
                isUpdateLinkError: true
            }, this.state));
        });
    }

    handleLinkRemoveClick = linkId => {
        deleteNewsTranslationLinkService(
            this.props.newsId,
            this.props.id,
            linkId
        ).then(() => {
            this.props.onRemoveTranslationLinkSuccess();
        });
    }

    render() {
        return (
            <div>
                <Divider />
                <AdminTitleField
                    title={this.state.updatedTitle}
                    label='Title'
                    onTitleChange={this.handleTitleChange}
                    isEdit={this.props.isEdit}
                    isError={this.state.isError}
                />
                <AdminDescriptionField
                    description={this.state.updatedDescription}
                    label='Description'
                    onDescriptionChange={this.handleDescriptionChange}
                    isEdit={this.props.isEdit}
                    isError={this.state.isError}
                />
                {
                    this.props.isEdit &&
                    <div style={buttonsWrapperStyle}>
                        <AdminButton
                            text='Save Translation'
                            color='primary'
                            variant='outlined'
                            disabled={!this.haveFieldsChanged()}
                            onClick={this.handleSaveTranslationClick}
                            style={buttonsStyle}
                        />
                        <AdminButton
                            text='Remove Translation'
                            color='secondary'
                            variant='outlined'
                            onClick={this.handleRemoveTranslationClick}
                            style={buttonsStyle}
                        />
                    </div>
                }
                <AdminNewsTranslationLinksList
                    links={this.props.links}
                    isEdit={this.props.isEdit}
                    isError={this.state.isUpdateLinkError}
                    onLinkUpdateClick={this.handleLinkUpdateClick}
                    onLinkRemoveClick={this.handleLinkRemoveClick}
                />
                {
                    this.props.isEdit &&
                    <AdminAddLinkForm
                        onAddLinkClick={this.handleAddLinkClick}
                        isError={this.state.isAddLinkFormError}
                    />
                }
            </div>
        );
    }
}

export default AdminNewsItemTranslation;
