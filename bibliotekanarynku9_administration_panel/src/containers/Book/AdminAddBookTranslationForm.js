import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AdminButton from '../../components/AdminButton';
import AdminLanguageSelect from '../../components/AdminLanguageSelect';
import AdminTitleField from '../../components/AdminTitleField';
import AdminDescriptionField from '../../components/AdminDescriptionField';
import AdminAuthorField from '../../components/AdminAuthorField/AdminAuthorField';
import {getUpdatedState} from '../../helpers';
import {postBookTranslationService} from './adminBookService';

const headerStyle = {
    marginTop: 15
};

const saveBtnStyle = {
    margin: 15
};

class AdminAddBookTranslationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            author: '',
            language: 'uk',
            isError: false
        };
    }

    componentWillReceiveProps() {
        this.setState(getUpdatedState({isError: false}, this.state));
    }

    handleTitleChange = newTitle => {
        this.setState(getUpdatedState({title: newTitle}, this.state));
    }

    handleDescriptionChange = newDescription => {
        this.setState(getUpdatedState({description: newDescription}, this.state));
    }

    handleAuthorChange = newAuthor => {
        this.setState(getUpdatedState({author: newAuthor}, this.state));
    }

    handleLanguageChange = newLanguage => {
        this.setState(getUpdatedState({language: newLanguage}, this.state));
    }

    handleAddTranslationClick = () => {
        postBookTranslationService(
            this.props.bookId,
            this.state.title,
            this.state.description,
            this.state.author,
            this.state.language
        ).then(() => {
            this.setState(getUpdatedState({
                title: '',
                description: '',
                author: '',
                language: 'uk',
                isError: false
            }, this.state));
            this.props.onAddTranslationSuccess();
        }).catch(() => {
            this.setState(getUpdatedState({isError: true}, this.state));
        });
    }

    render() {
        return (
            this.props.isEdit && (
                <div>
                    <Divider/>
                    <Typography component='h2' variant='headline' style={headerStyle}>
                        Add Translation Form
                    </Typography>
                    <AdminTitleField
                        title={this.state.title}
                        label='title'
                        onTitleChange={this.handleTitleChange}
                        isEdit={true}
                        isError={this.state.isError}
                    />
                    <AdminDescriptionField
                        description={this.state.description}
                        label='description'
                        onDescriptionChange={this.handleDescriptionChange}
                        isEdit={true}
                        isError={this.state.isError}
                    />
                    <AdminAuthorField
                        author={this.state.author}
                        label='author'
                        onAuthorChange={this.handleAuthorChange}
                        isEdit={true}
                        isError={this.state.isError}
                    />
                    <AdminLanguageSelect
                        language={this.state.language}
                        onLanguageChange={this.handleLanguageChange}
                        isError={this.state.isError}
                    />
                    <AdminButton
                        size='small'
                        color='primary'
                        variant='contained'
                        text='Add translation'
                        onClick={this.handleAddTranslationClick}
                        style={saveBtnStyle}
                    />
                </div>
            )
        );
    }
}

export default AdminAddBookTranslationForm;
