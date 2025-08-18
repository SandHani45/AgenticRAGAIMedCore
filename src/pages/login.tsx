import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            // Refetch user data after login
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
            navigate(`/${data?.user?.role}`);
          } else {
            setError(data.message || "Login failed");
          }
        },
        onError: (err: any) => {
          setError(err.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex flex-col items-center">
            {/* <img src="/assets/mediconnect-logo.png" alt="MediConnect Logo" className="h-16 mb-2" /> */}
            <CardTitle className="text-center text-3xl font-bold text-primary mb-1">MediConnect</CardTitle>
            <span className="text-muted-foreground text-sm mb-2">Sign in to your healthcare portal</span>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {loginMutation.status === "pending" && (
              <Alert>
                <AlertTitle>Logging in...</AlertTitle>
              </Alert>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Login</Button>
            <div className="mt-2 text-center text-sm">
              <span>Don't have an account? </span>
              <a href="/register" className="text-primary underline">Register</a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
