import AddComment from "./AddComment";
import CommentFeed from "./CommentFeed";
import UserModal from "./Friends/UserModal";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import {
  Card,
  Image,
  Text,
  Switch,
  Stack,
  Group,
  Avatar,
  Badge,
  Title,
  Button,
  ScrollArea,
  Modal,
  TextInput,
} from "@mantine/core";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@mantine/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPenToSquare,
  faTrashCan,
  faDog,
} from "@fortawesome/free-solid-svg-icons";

function EventDetail({
  image,
  event,
  rsvp,
  handleRsvp,
  user_id,
  handleDeleteEvent,
  handleEdit,
  canEdit,
  getEvents,
}) {
  const {
    name,
    address,
    date,
    prospective,
    description,
    group_name,
    event_id,
  } = event;
  const timeStamp = new Date(date);

  const [comments, setComments] = useState([{}]);
  const [attendees, setAttendees] = useState([{}]);
  const [modal, setModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [opened, handlers] = useDisclosure(false);

  function getComments() {
    axios
      .get(`/api/event/comment?id=${event_id}`)
      .then((data) => setComments(data.data[0].rows))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (event_id) {
      getComments();
    }
  }, [user_id]);

  useEffect(() => {
    if (event_id) {
      axios
        .get(`/api/event/rsvp?event_id=${event_id}`)
        .then((data) => setAttendees(data.data[0].rows))
        .catch((err) => console.log(err));
    }
  }, [rsvp, user_id]);

  const attendeeList = attendees.map((attendee, index) => {
    return (
      <Group
        key={index}
        position="apart"
        className="border-b-2 pb-1 pt-50 mb-3"
      >
        <Group>
          <Avatar
            src={attendee.photo}
            radius="xl"
            component="span"
            size={30}
            className="ml-2"
            onClick={() => setModal(true)}
          />
          <Text onClick={() => setModal(true)} className="ml-0">
            {attendee.name}
          </Text>
        </Group>
        <Avatar
          radius="xl"
          size={25}
          className="cursor-pointer shadow mr-2"
          onClick={() => {
            setModal(true);
          }}
        >
          <FontAwesomeIcon icon={faUserCircle} className="w-[55%] " />
        </Avatar>
        <Modal opened={modal} onClose={() => setModal(false)} size="xl">
          <UserModal userId={user_id} clicked={{ user_id: attendee.user_id }} />
        </Modal>
      </Group>
    );
  });

  const editEvent = (values) => {
    axios({
      method: "PATCH",
      url: "/api/events",
      params: {
        body: values,
      },
    })
      .then(() => getEvents())
      .catch((err) => {
        console.log(err);
      });
    setOpenEdit(false);
  };

  const editForm = useForm({
    initialValues: {
      name: "",
      date: "",
      description: "",
      address_1: "",
      event_id: event_id,
    },
  });

  return (
    <div className="flex w-full h-full items-top justify-center space-x-2">
      <Card
        className="sticky top-0 space-y-2 w-[30vw] min-w-[550px]"
        radius="10px"
        shadow="md"
      >
        <Card.Section className="bg-red text-white p-2">
          <Group className="Group" position="apart">
            <Group className="gap-0">
              <FontAwesomeIcon icon={faDog} className="fa-header-icons" />
              <Title className="font-semibold m-0" order={4}>
                {name}
              </Title>
            </Group>
            <Title className="font-normal mr-2" order={4}>
              {timeStamp.toLocaleString([], {
                dateStyle: "short",
              })}
            </Title>
          </Group>
        </Card.Section>
        <Stack>
          {canEdit ? (
            <Menu
              closeOnItemClick
              opened={opened}
              onOpen={handlers.open}
              onClose={handlers.close}
              className="menu-icon"
            >
              <Menu.Item>
                <Stack grow spacing={0}>
                  <Button
                    onClick={() => setOpenEdit(true)}
                    variant="outline"
                    className="event-edit-del-btn"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-del-icons"
                    />
                    EDIT
                  </Button>
                  <Button
                    onClick={handleDeleteEvent}
                    variant="outline"
                    className="event-edit-del-btn"
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="edit-del-icons"
                    />
                    DELETE
                  </Button>
                </Stack>
              </Menu.Item>
            </Menu>
          ) : null}
          {prospective ? <Badge color="red">PLANNING EVENT</Badge> : null}
        </Stack>
        <Card.Section className="h-[25vh] flex items-center justify-center space-x-4">
          <Stack>
            <img
              className="rounded-[10px] max-h-[25vh] max-w-[250px]"
              src={image}
            />
          </Stack>
        </Card.Section>

        <Card.Section className="p-2 mr-1 ml-1">
          <Group position="apart">
            <Badge color="cyan">{group_name}</Badge>
            <Switch
              color="cyan"
              checked={rsvp}
              onChange={handleRsvp}
              label={prospective ? "Interested?" : "RSVP"}
            ></Switch>
          </Group>
          <Title order={5} color="var(--black)" size="lg">
            {address}
          </Title>
          <Text color="var(--black)" size="md">
            {description}
          </Text>
        </Card.Section>
        <Card.Section>
          <AddComment
            user_id={user_id}
            event={event}
            setComments={setComments}
          />
        </Card.Section>
        <Card.Section
          className={`p-2 ${
            prospective ? "h-[25vh]" : "h-[29vh]"
          } overflow-auto`}
        >
          <CommentFeed
            comments={comments}
            isOwner={canEdit}
            getComments={getComments}
          />
        </Card.Section>
      </Card>
      <Card
        className="hidden md:inline space-y-1 min-w-[240px] h-[90vh]"
        radius="10px"
        shadow="sm"
      >
        <Card.Section className="bg-red text-white ">
          <Title className="p-2 font-semibold" align="center" order={4}>
            {prospective ? "Interested" : "RSVPs"}
          </Title>
        </Card.Section>
        <ScrollArea className="h-[98%] overflow-auto">
          {attendeeList}
        </ScrollArea>
      </Card>

      <Modal
        opened={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit event"
      >
        <form onSubmit={editForm.onSubmit((values) => editEvent(values))}>
          <TextInput
            placeholder="Event Name"
            label="Event name"
            required
            {...editForm.getInputProps("name")}
          />
          <TextInput
            placeholder="Address Line 1"
            label="Address"
            required
            {...editForm.getInputProps("address_1")}
          />
          <TextInput
            placeholder="description"
            label="Description"
            required
            {...editForm.getInputProps("description")}
          />
          <DatePicker
            placeholder="Pick date"
            label="Event date"
            required
            {...editForm.getInputProps("date")}
          />

          <Group position="right" mt="md">
            <Button className="teal-btn" type="submit">
              Update
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
}

export default EventDetail;
