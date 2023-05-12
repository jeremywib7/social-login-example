import {signOut, useSession} from "next-auth/react";
import React, {useEffect} from "react";
import {Button} from "primereact/button";

const Home = () => {
    const {data} = useSession();

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data])

    return (
        <>
            <div
                className="flex justify-content-center align-items-center min-h-screen min-w-screen">
                <Button label="Logout" onClick={() => signOut({redirect: true, callbackUrl: ""})}/>
            </div>
        </>
    );
}

export default Home;
