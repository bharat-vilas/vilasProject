import { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/login", values);
      message.success(res.data.message);
      localStorage.setItem("isAdmin", "true");
      navigate("../main-page/app"); // Redirect to main app page
    } catch (err: any) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("/Repair_image.jpg")`, // 👈 Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card style={{ width: 400, boxShadow: "-moz-initial" }} bordered={false}>
        <Title level={1} style={{ textAlign: "center" }}>
          Admin Login
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                backgroundColor: "#486A47",
                borderColor: "#486A47",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
