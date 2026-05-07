export type RichTextLeaf = {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type RichTextNode = {
  id?: string;
  type?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children?: RichTextNode[];
};

export type ChoiceItem = {
  id: string;
  outgoingEdgeId?: string;
  content: string;
  displayCondition?: { isEnabled?: boolean };
};

export type Block =
  | { id: string; type: 'text'; content: { richText: RichTextNode[] } }
  | { id: string; type: 'image'; content: { url: string } }
  | {
      id: string;
      type: 'audio';
      content: { url: string; isAutoplayEnabled?: boolean };
    }
  | { id: string; type: 'Wait'; options: { secondsToWaitFor: string | number }; outgoingEdgeId?: string }
  | {
      id: string;
      type: 'choice input';
      items: ChoiceItem[];
      outgoingEdgeId?: string;
      options?: { variableId?: string; isMultipleChoice?: boolean; buttonLabel?: string };
    }
  | {
      id: string;
      type: 'text input';
      outgoingEdgeId?: string;
      options?: {
        labels?: { placeholder?: string };
        variableId?: string;
        inputMode?: 'text' | 'numeric';
        isLong?: boolean;
      };
    }
  | {
      id: string;
      type: 'Code';
      options: { content: string; isExecutedOnClient?: boolean };
      outgoingEdgeId?: string;
    }
  | {
      id: string;
      type: 'Webhook';
      options: {
        webhook: { method: string; url: string };
        responseVariableMapping?: Array<{ id: string; variableId: string; bodyPath: string }>;
        isExecutedOnClient?: boolean;
      };
      outgoingEdgeId?: string;
    }
  | { id: string; type: 'Redirect'; options: { url: string }; outgoingEdgeId?: string };

export type Group = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Edge = {
  id: string;
  from: { eventId?: string; blockId?: string; itemId?: string };
  to: { groupId: string; blockId?: string };
};

export type TypebotEvent = {
  id: string;
  outgoingEdgeId: string;
  type: 'start';
};

export type Variable = {
  id: string;
  name: string;
  isSessionVariable?: boolean;
  value?: string;
};

export type Typebot = {
  version: string;
  id: string;
  name: string;
  events: TypebotEvent | TypebotEvent[];
  groups: Group[];
  edges: Edge[];
  variables: Variable[];
  theme: any;
  settings: any;
};
