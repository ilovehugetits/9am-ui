"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default function FieldHorizontal() {
  return (
    <FieldGroup className="w-[380px]">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Test drives</FieldTitle>
          <FieldDescription>Let players drive before buying.</FieldDescription>
        </FieldContent>
        <Switch defaultChecked />
      </Field>
      <FieldSeparator />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Financing</FieldTitle>
          <FieldDescription>Allow purchase in instalments.</FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
    </FieldGroup>
  );
}
