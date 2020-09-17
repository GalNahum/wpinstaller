'use strict';

const is_empty_str = str => str.toString().trim() === '';

const confirm_answer_not_empty_validator = input => {
    return !is_empty_str(input) || 'This field is required';
};

exports.questions = () => {
    return [
        {
            type: 'list',
            name: 'language',
            message: "Site language:",
            choices: ['en'],
            default: 'en'
        },
        {
            type: 'input',
            name: 'dbname',
            message: "Database:",
            default: 'test_node_101',
            //validate: confirm_answer_not_empty_validator
        },
        {
            type: 'input',
            name: 'uname',
            message: "User:",
            default: 'root',
            validate: confirm_answer_not_empty_validator
        },
        {
            type: 'input',
            name: 'pwd',
            message: "User password:",
            default: ''
        },
        {
            type: 'input',
            name: 'port',
            message: "Port:",
            default: '8080',
            validate: input => !is_empty_str( input ) && parseInt( input ) >= 1 || 'Invalid port'
        },
        {
            type: 'input',
            name: 'dbhost',
            message: "Host:",
            default: 'localhost'
        },
        {
            type: 'input',
            name: 'prefix',
            message: "Prefix:",
            default: 'wp_'
        },
        {
            type: 'input',
            name: 'weblog_title',
            message: "Site title:",
            default: 'Simple site title'
        },
        {
            type: 'input',
            name: 'user_name',
            message: "Admin username:",
            default: 'admin'
        },
        {
            type: 'input',
            name: 'admin_password',
            message: "Admin password:",
            default: '123456'
        },
        {
            type: 'input',
            name: 'admin_email',
            message: "Admin email:",
            default: 'admin@wp.com'
        }
    ]
};


exports.database_exist = dbname => [
    {
        type: 'confirm',
        name: 'confirm',
        message: `The database ${dbname} is already exist, would you like to continue anyway?`,
        default: true
    }
];