import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import TreeData from "./TreeData";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function DataTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.json())
        .then((data: Post[]) => setPosts(data))
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "User ID",
      width: 90,
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "details", headerName: "Details", width: 130 },
  ];
  // const rows = [{ id: 1, lastName: "Snow", firstName: "Jon", age: 35 }];
  const rows = posts?.map((post) => ({
    userId: post.userId,
    id: post.id,
    title: post.title,
    details: post.body,
  }));

  console.log("j", posts);

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "center", m: "20px 0" }}>
        User Data
      </Typography>
      {rows && (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      )}
      <TreeData />
    </>
  );
}
