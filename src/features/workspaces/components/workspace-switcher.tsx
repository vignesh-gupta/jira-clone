"use client";

import React from "react";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceAvatar from "./workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Loader2 } from "lucide-react";

const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const onSelect = (value: string) => {
    if (value !== "none") {
      router.push(`/workspaces/${value}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 hover:opacity-75 transition cursor-pointer" />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {isLoading && (
            <SelectItem disabled value="none">
              <div className="flex text-neutral-700">
                <Loader2 className="mr-2 animate-spin size-5" /> Loading...
              </div>
            </SelectItem>
          )}
          {!isLoading &&
            workspaces?.documents.length &&
            workspaces?.documents?.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          {!isLoading && !workspaces?.documents.length && (
            <SelectItem disabled value="none">
              <span>No Workspaces</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
