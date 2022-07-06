import { Menu } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  return (
    <Menu pointing secondary>
      <Menu.Item active={router.pathname == "/"}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item active={router.pathname == "/tasks"}>
        <Link href="/tasks">
          <a>Tasks</a>
        </Link>
      </Menu.Item>
      <Menu.Item active={router.pathname == "/create-task"}>
        <Link href="/create-task">
          <a>Create task</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};
export default Header;
