import type { Route } from "./+types/home";
import Welcome from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome to Xrinema" },
    { name: "description", content: "A website showing the latest movies!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
