import { URL_AUTH_API, URL_LOGIN_API, URL_UPDATE_API } from "../../constants/dataBase";

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (name: string, email: string, password: string) => {
  return async (dispatch: any) => {
    const response = await fetch(URL_AUTH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    const updateResponse = await fetch(URL_UPDATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: data.idToken,
        displayName: name,
      }),
    });

    const userData = await updateResponse.json();

    dispatch({
      type: SIGNUP,
      token: data.idToken,
      userId: data.localId,
    });
  }
}

export const login = (email: string, password: string) => {
  return async (dispatch: any) => {
    const response = await fetch(URL_LOGIN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorID = errorResponse.error.message;

      let message = 'Can not log in';
      if (errorID === 'EMAIL_NOT_FOUND') message = 'We do not have this email in our data base';

      throw new Error(message);
    }

    const data = await response.json();

    dispatch({
      type: LOGIN,
      token: data.isToken,
      userId: data.localId,
    });
  }
}

// export const lookupUser = (token?: any) => {
//   return async (dispatch: any) => {
//     const response = await fetch(URL_LOOKUP_API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         idToken: token,
//       }),
//     });
//     const data = await response.json();

//     dispatch({
//       type: LOOKUP,
//       data,
//     });
//   }
// }