import { Amplify } from 'aws-amplify';

const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code' as const,
    },
  },
};

// Configure Amplify
Amplify.configure(cognitoConfig);

export { cognitoConfig };
