"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldBasic() {
  return (
    <FieldGroup className="w-[320px]">
      <Field>
        <FieldLabel htmlFor="price">Sale price</FieldLabel>
        <Input id="price" type="number" defaultValue={50000} />
        <FieldDescription>Before tax, in the server currency.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="stock">Stock</FieldLabel>
        <Input id="stock" type="number" defaultValue={-1} aria-invalid />
        <FieldError>Stock cannot be negative.</FieldError>
      </Field>
    </FieldGroup>
  );
}
