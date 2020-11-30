import {APIGatewayAuthorizerResult} from 'aws-lambda';

const generatePolicy: APIGatewayAuthorizerResult 
    = (principalId, resource, effect = 'Allow') => ({
        principalId,
        policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
            },
        ],
        },
    });
  
  export const basicAuthorizer = async (event, ctx, cb) => {
    console.log("basicAuthorizer => Lambda started execution", event);
    
    if (event.type !== 'TOKEN') {
      cb('Unauthorized');
    }
  
    try {
      const { authorizationToken } = event;  
      let effect = true;
      let userName = 'unknown';
  
        try {
          const encodedCredentials = authorizationToken.split(' ')[1];
          const buffer = Buffer.from(encodedCredentials, 'base64');
          const plainCredentials = buffer.toString('utf-8').split(':');
          userName = plainCredentials[0];
          const password = plainCredentials[1];
  
          console.log(`username: ${userName}; password: ${password}`);
  
          const storedUserPassword = process.env[userName];
  
          effect = storedUserPassword && (storedUserPassword === password);
        } catch (e) {
          effect = false;
        }
  
      const policy 
      = generatePolicy(
          userName, 
          event.methodArn, 
          effect ? 'Allow' : 'Deny'
        );
  
      cb(null, policy);
    } catch (e) {
      cb(`Unauthorized: ${e.message}`);
    }
  };
