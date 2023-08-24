import { Lock } from "@mui/icons-material";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

interface User {
  name: string;
  phoneNumber: string;
  email: string;
}

const GetInfoForm = () => {
  const navigate = useNavigate();
  const form = useForm<User>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: User) => {
    navigate("/second");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" flexDirection="column" width={400} mt={15} gap={4}>
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Lock
            sx={{
              alignSelf: "center",
              bgcolor: "purple",
              p: 2,
              borderRadius: 7,
              color: "white",
            }}
          />
          <Typography variant="h6" textAlign="center">
            Give Your Info
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={3}>
            <TextField
              label="Name"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Phone Number"
              type="number"
              {...register("phoneNumber", { required: "Number is required" })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            <TextField
              type="email"
              label="Email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Button type="submit" variant="contained">
              Next
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default GetInfoForm;
