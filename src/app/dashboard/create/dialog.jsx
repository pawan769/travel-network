"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import CreatePost from "./page";

const ModalExample = ({ open, setModalOpen }) => {
  return (
    <div className="flex  items-center">
      <Dialog open={open} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-none max-h-none w-auto h-auto p-2">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div>
            <CreatePost setModalOpen={setModalOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ModalExample;
