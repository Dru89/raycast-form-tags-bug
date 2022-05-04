import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { useReducer, useState } from "react";
import dedent from "ts-dedent";

type FormAction = { field: "tags"; value: string[] } | { field: "text"; value: string };

interface FormState {
  tags: string[];
  text: string;
}

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.field) {
    case "tags":
      return { ...state, tags: action.value };
    case "text":
      return { ...state, text: action.value };
    default:
      throw new Error(`Unknown action: ${JSON.stringify(action)}`);
  }
}

export default function Command() {
  const [details, setDetails] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, { tags: [], text: "" });

  const append = (message: string) => {
    setDetails((details) => [...details, message]);
  };

  const handleChange = (action: FormAction) => {
    append(`${action.field} changed: ${JSON.stringify(action.value)}, was: ${JSON.stringify(state[action.field])}`);
    dispatch(action);
  };

  return (
    <Form navigationTitle="Form Bug">
      <Form.Description
        title="Bug Description"
        text={dedent`
        Steps to Reproduce: Load form, look at "Changed"

        Expected: No changes should be received yet.

        Actual: \`tags\` changed (from \`[]\` to \`[]\`)
      `}
      />
      <Form.TextField
        title="Text Field"
        id="text"
        value={state.text}
        onChange={(value) => handleChange({ field: "text", value })}
      />
      <Form.TagPicker
        title="🌈 Tags"
        id="tags"
        value={state.tags}
        onChange={(value) => handleChange({ field: "tags", value })}
      >
        <Form.TagPicker.Item title="Red" value="red" />
        <Form.TagPicker.Item title="Orange" value="orange" />
        <Form.TagPicker.Item title="Yellow" value="yellow" />
        <Form.TagPicker.Item title="Green" value="green" />
        <Form.TagPicker.Item title="Blue" value="blue" />
        <Form.TagPicker.Item title="Indigo" value="indigo" />
        <Form.TagPicker.Item title="Violet" value="violet" />
      </Form.TagPicker>
      <Form.Description title="Form Changes" text={details.slice(-5).join("\n")} />
    </Form>
  );
}
