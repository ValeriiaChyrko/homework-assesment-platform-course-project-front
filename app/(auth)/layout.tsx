﻿const AuthLayout = ({
    children
}:{
    children:React.ReactNode
}) => {
  return (
      <div className="h-full flex flex-col items-center justify-center min-h-screen bg-white">
          {children}
      </div>
  );
}

export default AuthLayout;