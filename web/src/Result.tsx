import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Kbd,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import config from "./config";

function Character({ char }: { char: string }) {
  const isNumber = !isNaN(Number(char));
  const color = isNumber ? "red" : undefined;

  return (
    <Text
      fontSize="2xl"
      color={color}
      userSelect="none"
      _hover={{ cursor: "default" }}
    >
      {char}
    </Text>
  );
}

function Result({ code }: { code: string }) {
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const toast = useToast();

  function copyShortUrl() {
    navigator.clipboard.writeText(`${config.AFUS_URL}/${code}`);
    toast({
      title: "Copied!",
      status: "success",
    });
  }

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.metaKey && event.code === "KeyC") {
        copyShortUrl();
      }
      if (event.metaKey && event.code === "KeyE") {
        setQrCodeOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [code]);

  return (
    <>
      <Card w="100%" display={code === "" ? "none" : undefined}>
        <CardBody display="flex" flexDirection="row">
          <Text fontSize="2xl" userSelect="none" _hover={{ cursor: "default" }}>
            {config.AFUS_URL}/
          </Text>
          {code.split("").map((char, index) => (
            <Character key={index} char={char} />
          ))}
        </CardBody>
        <CardFooter>
          <Button onClick={copyShortUrl}>
            Copy
            <Box w="8px" />
            <Kbd>⌘</Kbd>
            <Box w="4px" />
            <Kbd>C</Kbd>
          </Button>
          <Box w="12px" />
          <Button onClick={() => setQrCodeOpen(true)}>
            QR Code
            <Box w="8px" />
            <Kbd>⌘</Kbd>
            <Box w="4px" />
            <Kbd>E</Kbd>
          </Button>
        </CardFooter>
      </Card>
      <Modal
        isCentered
        isOpen={qrCodeOpen}
        onClose={() => setQrCodeOpen(false)}
      >
        <ModalOverlay />
        <ModalContent h="85vw" w="85vw" maxH="400px" maxW="400px">
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <Center h="100%" w="100%">
            <QRCodeSVG
              height="75%"
              width="75%"
              value={`${config.AFUS_URL}/${code}`}
            />
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Result;
