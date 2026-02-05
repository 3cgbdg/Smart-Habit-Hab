"use client";

import { Box, Button, Paper, TextField, Typography, Link as MuiLink } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import NextLink from "next/link";
import { AuthFormData, AuthFormSchema } from "@/validation/AuthFormSchema";
import authService from "@/services/AuthService";

interface AuthFormProps {
    mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const isLogin = mode === "login";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: zodResolver(AuthFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: AuthFormData) => {
            const response = isLogin ? await authService.logIn(data) : await authService.signUp(data);
            return response.message;
        },
        onSuccess: (data: string | undefined) => {
            toast.success(data);
            router.push("/dashboard");
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error?.response?.data?.message || error.message || `${isLogin ? "Login" : "Signup"} failed`);
        },
    });

    const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
            <h1 className="section-title">{isLogin ? "Login" : "Sign Up"}</h1>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    loading={mutation.isPending}
                    sx={{ mt: 1 }}
                >
                    {isLogin ? "Sign In" : "Create Account"}
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                    <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                    <Typography variant="body2" sx={{ px: 2, color: "text.secondary" }}>
                        OR
                    </Typography>
                    <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
                    sx={{
                        py: 1,
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": {
                            bgcolor: "action.hover",
                            borderColor: "text.primary",
                        },
                    }}
                >
                    {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </Button>

                <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <MuiLink
                        component={NextLink}
                        href={isLogin ? "/auth/signup" : "/auth/login"}
                        underline="hover"
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </MuiLink>
                </Typography>
            </Box>
        </Paper>
    );
}
