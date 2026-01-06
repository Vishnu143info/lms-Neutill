import React from "react";
import Header from "../components/Header";


const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
     
    </>
  );
};

export default PublicLayout;
