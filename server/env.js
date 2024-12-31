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
    try {
        const apiKey = process.env.API_KEY;
        const YTEL_PASS = process.env.YTEL_PASS;
        const apiUrl = 'https://7fwwglseys3xlqk6hogiazspv40gzoug.lambda-url.us-east-1.on.aws/api/generate-token'; // Replace with your API endpoint
        const body = JSON.parse(event.body);
        let res = { message: 'Success!' };
        let statusCode = 200;

        const { offer_code, first_name, last_name, email, phone_number, loan_amount } = body;

        const errors = validateFields(body);
        if (errors.length > 0) {
            console.error("Validation errors:", errors);
            statusCode = 400;
            res = errors;
        } else {
            const response = await axios.post(
                apiUrl,
                {},
                {
                    headers: {
                        'x-api-key': apiKey,
                    },
                }
            );
            const token = response.data?.token;
            if (response?.status == 200) {
                const responseAddLead = await axios.post(
                    'https://7fwwglseys3xlqk6hogiazspv40gzoug.lambda-url.us-east-1.on.aws/api/create-lead-basic-info',
                    {
                        offer_code: offer_code,
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        phone_number: phone_number,
                        loan_amount: loan_amount,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                if (responseAddLead?.status == 200) {
                    const config = {
                        method: "get",
                        maxBodyLength: Infinity,
                        url: `https://cashkeeper.ytel.com/x5/api/non_agent.php?function=add_lead
                                  &user=Ytel2617220
                                  &pass=${YTEL_PASS}
                                  &source=postman
                                  &add_to_hopper=Y
                                  &hopper_priority=99
                                  &campaign_id=Closer
                                  &phone_number=${phone_number?.replace(/[^0-9]/g, '')}
                                  &list_id=1002
                                  &phone_code=
                                  &dnc_check=
                                  &campaign_dnc_check=
                                  &usacan_prefix_check=
                                  &usacan_areacode_check=
                                  &custom_fields=
                                  &tz_method=
                                  &callback=
                                  &callback_status=
                                  &callback_datetime=
                                  &callback_type=
                                  &callback_user=
                                  &callback_comments=
                                  &vendor_lead_code=
                                  &source_id=
                                  &gmt_offset_now=
                                  &title=
                                  &first_name=${first_name}
                                  &middle_initial=
                                  &last_name=${last_name}
                                  &address1=
                                  &address2=
                                  &address3=
                                  &city=
                                  &state=
                                  &province=
                                  &postal_code=
                                  &country_code=
                                  &gender=
                                  &date_of_birth=
                                  &email=
                                  &comments=
                                  &multi_alt_phones=`,
                        headers: {},
                    };
                    console.log(config)
                    await axios(config)
                        .then(async function (responseYtel) {
                            console.log("initiateCallYtel", responseYtel?.data);
                        })
                        .catch(async function (error) {
                            console.log("ErrorCallYtel", error);
                        });


                } else {
                    statusCode = 500;
                    res = { message: "internal server error - add lead" }
                }

            }

        }

        return {
            statusCode: statusCode,
            body: JSON.stringify(res),
        };

    } catch (error) {
        console.error('Error connecting to the API:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
