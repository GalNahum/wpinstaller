'use strict';

function Client(page) {
    this.page = page;
}

Client.prototype.typing = async function( inputs_data = {} ) {
    for ( let property in inputs_data ){
        await this.page.$eval(`input[name="${property}"]`, (el, value) => el.value = value, inputs_data[property]);
    }
};

Client.prototype.wait_for_submit = async function() {
    await this.page.waitForSelector('input[type="submit"]')
};

Client.prototype.submit_form = async function() {
    await this.page.$eval( 'input[type="submit"]', $submit => $submit.click() );
};

Client.prototype.click = async function( selector, waitForSelector = false ) {
    if( waitForSelector ) {
        await this.page.waitForSelector( selector );
    }
    await this.page.$eval( selector, form => form.click() );
};

Client.prototype.checked = async function( selector ) {
    await this.page.evaluate(async selector => {
        let $checkbox = document.querySelector(selector);
        if( $checkbox ) {
            $checkbox.checked = true;
        }
    }, selector);
};

module.exports = Client;


