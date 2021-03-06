import React, { useState, useEffect } from "react";
import { Group, ScrollArea, Stack, Text } from "@mantine/core";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GroupList({ groupCount, currentGroups }) {
  const { user } = useUser();
  const user_id =
    user?.sub.split("google-oauth2|")[1] || user?.sub.split("auth0|")[1];

  const [UserGroups, setUserGroups] = useState([]);
  useEffect(() => {
    axios.get(`/api/usergroup?user_id=${user_id}`).then((data) => {
      setUserGroups(data.data[0].rows);
    });
  }, [user_id, groupCount]);
  return (
    <Stack className="h-[49vh]">
      <ScrollArea offsetScrollbars scrollbarSize={8} className="mt-2">
        {UserGroups.map(({ group_id, name, description }, index) => {
          return (
            <Link key={index} href={`/group?id=${group_id}`} passHref>
              <Stack className="cursor-pointer mb-2 gap-2 group-box">
                <Text weight={700} className="group-title-text">
                  {name}
                </Text>
                <Text className="italic group-desc-text" size="xs">
                  {description.slice(0, 100)}
                </Text>
              </Stack>
            </Link>
          );
        })}
      </ScrollArea>
    </Stack>
  );
}

export default GroupList;
