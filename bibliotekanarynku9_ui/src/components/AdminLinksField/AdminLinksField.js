import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import Link from '@material-ui/icons/Link';
import AdminButton from '../../components/AdminButton';
import {getUpdatedState} from '../../helpers';

const style = {
    margin: '10px 0'
};

const linkInputStyle = {
    margin: '0 15px'
};

const headLabelStyle = {
    fontWeight: 'bold'
};

export default class AdminLinksField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            label: '',
            href: ''
        };
    }

    handleChange = (event, linkId, fieldType) => {
        this.props.onLinkChange(event.target.value, linkId, fieldType);
    }

    handleChangeDecorator = (linkId, fieldType) => {
        const id = linkId,
            type = fieldType;
        return event => {this.handleChange(event, id, type);};
    }

    handleAddLinkClick = () => {
        this.props.onAddLinkClick(this.state.label, this.state.href);
        this.setState(getUpdatedState({
            label: '',
            href: ''
        }, this.state));
    }

    handleAddLinkInputChange = event => {
        const newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(getUpdatedState(newState, this.state));
    }

    renderEditField = () => {
        return (
            <div>
                <List component='div'>
                    {
                        this.props.links.map(link => (
                            <ListItem button>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <TextField
                                    style={linkInputStyle}
                                    label={'label'}
                                    value={link.label}
                                    onChange={this.handleChangeDecorator(link.id, 'label')}
                                    error={this.props.isError}
                                />
                                <TextField
                                    style={linkInputStyle}
                                    label={'href'}
                                    value={link.href}
                                    onChange={this.handleChangeDecorator(link.id, 'href')}
                                    error={this.props.isError}
                                />
                            </ListItem>
                        ))
                    }
                </List>
                <AdminButton
                    size='small'
                    color='primary'
                    variant='outlined'
                    onClick={this.handleAddLinkClick}
                    text={'Add Link'}
                />
                <TextField
                    style={linkInputStyle}
                    name='label'
                    label='label'
                    value={this.state.label}
                    onChange={this.handleAddLinkInputChange}
                    error={this.props.isError}
                    fullWidth={true}
                />
                <TextField
                    style={linkInputStyle}
                    name='href'
                    label='href'
                    value={this.state.href}
                    onChange={this.handleAddLinkInputChange}
                    error={this.props.isError}
                    fullWidth={true}
                />
            </div>
        );
    }

    renderLookUpField = () => {
        return (
            <div>
                <List component='div'>
                    {
                        this.props.links.map(link => (
                            <ListItem button>
                                <ListItemIcon>
                                    <Link />
                                </ListItemIcon>
                                <ListItemText primary={`label: ${link.label}`} />
                                <ListItemText primary={`href: ${link.href}`} />
                            </ListItem>
                        ))
                    }
                </List>
            </div>
        );
    }

    render() {
        return (
            this.props.links.length ? (
                <div style={style}>
                    <Typography component='p' variant='subheading'>
                        <span style={headLabelStyle}>{'Links:'}</span>
                    </Typography>
                    {this.props.isEdit ? this.renderEditField() : this.renderLookUpField()}
                </div>
            ) : null
        );
    }
}
