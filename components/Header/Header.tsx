import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = () => {
  return (
    <Menu pointing secondary>
      <Menu.Item>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/tasks">
          <a>Tasks</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};
export default Header;
