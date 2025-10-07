import React from 'react';
import SlashScreen from '@/components/SplashScreen';
import { GetCurrentUser } from '@/services/accout';
import { IUserInfo, useUserInfo } from '@/store/userInfoStore';

interface InitialAuthStateProps {
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialAuthState: InitialAuthStateProps = {
  isAuthenticated: false,
  isInitialized: false
};

const AuthContext = React.createContext({
  ...initialAuthState,
  signIn: async (data: any) => Promise.resolve(),
  signOut: () => Promise
});

interface IAuthProviderProps {
  children: React.ReactNode;
}

const ACTION_TYPE = {
  INITIALIZE: 'INITIALIZE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

const reducer = (state: any, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case ACTION_TYPE.INITIALIZE: {
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user
      };
    }
    case ACTION_TYPE.LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case ACTION_TYPE.LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    }
    default: {
      return state;
    }
  }
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialAuthState);
  const { setUserInfo } = useUserInfo();

  const signIn = async (data: any) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    let userInfo = null;
    try {
      if (data.token) {
        const responseUserInfo: any = await GetCurrentUser();
        // const countNotification: any = await GetNotificationCount();
        // const listStore: any = await handleGetListStore();
        // const newNotificationNumber: number = await GetNewNotificationCount();
        if (responseUserInfo) {
          userInfo = responseUserInfo;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          setUserInfo(responseUserInfo?.data);
          //     userInfo = responseUserInfo;
          //     if (userInfo) {
          //         localStorage.setItem('userInfo', JSON.stringify(userInfo));
          //         setUserInformation(userInfo);
          //     }
          //     const permissionResponse = await GetPermission();
          //     setPermission(permissionResponse.permissions);
        }
        // if (countNotification?.countUnseen >= 0) {
        //     setNotiUnseen(countNotification?.countUnseen || 0);
        // }
        // setNewOrderNotiUnseen(newNotificationNumber);
        // if (listStore?.lookupBranches?.items?.length > 0) {
        //     const branchData = listStore?.lookupBranches?.items?.map((e: object, i: number) => {
        //         return {
        //             ...e,
        //             color: BACKGROUND_COLOR_CHART[i]
        //         };
        //     });
        //     setListStoreInformation(branchData);
        // }
        // handleRealtime();
      }
    } catch (error) {
      localStorage.clear();
      // onDeleteToken();
      // setToastInformation({ status: STATUS_TOAST.ERROR, message: 'Hệ thống lỗi vui lòng thử lại sau' });
    } finally {
      dispatch({
        type: ACTION_TYPE.LOGIN,
        payload: {
          user: userInfo
        }
      });
    }
    return true;
  };

  const signOut = () => {
    localStorage.clear();
    dispatch({ type: ACTION_TYPE.LOGOUT });
  };

  const initData = async () => {
    let token = localStorage.getItem('token');
    let userInfo: IUserInfo | null = null;
    try {
      if (token) {
        const responseUserInfo: any = await GetCurrentUser();

        // const countNotification: any = await GetNotificationCount();
        // const listStore: any = await handleGetListStore();
        // const newNotificationNumber: number = await GetNewNotificationCount();
        if (responseUserInfo) {
          userInfo = responseUserInfo;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          setUserInfo(responseUserInfo?.data);
          // const permissionResponse = await GetPermission();
          // setPermission(permissionResponse.permissions);
        }
        // if (countNotification?.countUnseen >= 0) {
        //     setNotiUnseen(countNotification?.countUnseen || 0);
        // }
        // setNewOrderNotiUnseen(newNotificationNumber);
      }
    } catch (error) {
      localStorage.clear();
      // onDeleteToken();
      // setToastInformation({ status: STATUS_TOAST.ERROR, message: 'Hệ thống lỗi vui lòng thử lại sau' });
    } finally {
      setTimeout(() => {
        dispatch({
          type: ACTION_TYPE.INITIALIZE,
          payload: {
            isAuthenticated: Boolean(token && userInfo),
            user: userInfo
          }
        });
      }, 200);
    }
  };

  React.useEffect(() => {
    initData();
    // eslint-disable-next-line
    // getToken();
  }, []);

  if (!state.isInitialized) {
    return <SlashScreen />;
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          ...state,
          signOut,
          signIn
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
