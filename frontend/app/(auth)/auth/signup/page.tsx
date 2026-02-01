"use client";

import authService from "@/services/AuthService";
import { AuthFormData, AuthFormSchema } from "@/validation/AuthFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Paper, TextField, Typography, Link as MuiLink } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SignupPage() {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // tanstack wrapper
  const mutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      const response = await authService.signUp(data);
      return response.message;
    },
    onSuccess: (data: string | undefined) => {
      toast.success(data);
      router.push("/dashboard")

    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message || error.message || "Login failed");
    }
  });

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <h1 className="section-title">Sign Up</h1>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
            Create Account
          </Button>
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <MuiLink component={NextLink} href="/auth/login" underline="hover">
              Log in
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

