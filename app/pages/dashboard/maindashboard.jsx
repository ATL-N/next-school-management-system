"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./admindashboard/page";
import ParentDashboard from "./parentdashboard/page";
import Studentdashboard from "./studentdashboard/page";
import TeacherDashboard from "./teacherdashboard/page";
import Navigation from "../../components/Navigation";
import LoadingPage from "../../components/generalLoadingpage";


const Maindashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log('user session data:',session )

    if (status === "loading") {
      return (
        <div className="text-cyan-700">
          <LoadingPage />
        </div>
      );
    }

  // useEffect(() => {
  //   // Wait for the session to load before rendering the component
  //   if (status === "loading") {
  //     return;
  //   }
  // }, [status, router]);

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // if (!session) {
  //    router.push("/authentication/login");
  //   // console.log("running the !session");
  //   // return <div className="flex">Unauthorized</div>;
  // }

  return (
    <>
      {/* <Navigation /> */}

      {session?.user?.roles?.includes("admin") && <AdminDashboard />}
      {session?.user?.roles?.includes("parent") && <ParentDashboard />}
      {session?.user?.role === "student" && <Studentdashboard />}
      {session?.user?.role === "teaching staff" && <TeacherDashboard />}
    </>
  );
};

export default Maindashboard;
