'use client';
import { Container } from '@mui/material';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <AuthForm mode="login" />
    </Container>
  );
}
