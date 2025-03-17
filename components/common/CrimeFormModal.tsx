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
      <Button onPress={onOpen} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Report a Crime
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        classNames={{
            body: "py-6",
            backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
            base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
            header: "border-b-[1px] border-[#292f46] ",
            footer: "border-t-[1px] border-[#292f46]",
            closeButton: "hidden",
        }}
      >
        <ModalContent className="w-full max-w-2xl bg-black p-6 rounded-2xl flex flex-col ">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold mb-4">
                Report a Crime
              </ModalHeader>
              <ModalBody className="space-y-4">
                <CrimeForm onClose={onClose} onSubmit={onSubmit} />
              </ModalBody>
              <ModalFooter className="flex justify-end gap-2 mt-4">

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
