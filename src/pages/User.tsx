import React from "react";
import { DataTable } from "../components/data-table";
import { columns } from "../components/users/columns";
import { useUser } from "../hooks/useUser";

const User = () => {
  const { data, isLoading } = useUser();
  return (
    <div>
       <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default User;
