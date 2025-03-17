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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        classNames={{
          container: "fixed inset-0 z-50 flex items-center justify-center", // Force the modal to be fixed and centered
          backdrop: "bg-black/90 bg-opacity-50", // A semi-transparent backdrop
        }}
      >
        <ModalContent className="w-full max-w-4xl bg-black p-6 rounded-2xl">
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
