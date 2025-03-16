"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import CrimeForm, { FormData } from "./CrimeForm";

export default function CrimeFormModal({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {/* Button to open the modal */}
      <Button onPress={onOpen} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Report a Crime
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="flex flex-col justify-center items-center w-full max-w-4xl p-6">
          {(onClose) => (
            <div className="w-full bg-black p-4 rounded-2xl">
              <ModalHeader className="text-xl font-bold mb-4">
                Report a Crime
              </ModalHeader>
              <ModalBody className="space-y-4">
                <CrimeForm onClose={onClose} onSubmit={onSubmit} />
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
