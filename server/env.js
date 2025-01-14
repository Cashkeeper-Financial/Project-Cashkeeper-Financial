import axios from 'axios';

function validateFields(body) {
    const errors = [];
    if (!body.first_name) errors.push("First name is required.");
    if (!body.last_name) errors.push("Last name is required.");
    if (!body.email) errors.push("Email is required.");
    if (!body.phone_number || !body.phone_number.length == 10) errors.push("Invalid phone number!");
    if (!body.loan_amount) errors.push("Loan amount is required.");
    return errors;
}

exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      body: "Hello, world!",
    };
  };
  
