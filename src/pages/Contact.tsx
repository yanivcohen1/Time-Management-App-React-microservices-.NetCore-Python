import React from "react";
import { useLocation } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";

const MyComponent: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // string | null
    const name = queryParams.get("name");
    const items = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => {
                console.log("Home clicked!");
            }
        },
        {
            label: "Products",
            command: () => {
                alert("Products clicked!");
            }
        }];

    const home = {
        icon: "pi pi-home",
        url: "/"
    };

    return (
        <>
            <div className="p-4 custom-breadcrumb">
                <BreadCrumb model={items} home={home} />
            </div>
            <div className="p-4">
                <h1>Contact</h1>
                <h3 className="text-xl font-bold">Query: ID={id} name={name}</h3>
            </div>
            
        </>
    );
};

export default MyComponent;
