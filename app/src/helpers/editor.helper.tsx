export const textEditorClassname = "rdg-text-editor appearance-none w-full ps-2 pe-2 border border-gray-200 align-top bg-gray-200";

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function editorText<TRow, TSummaryRow>({ row, column, onRowChange, onClose }: any) {
  return (
    <input
      className={textEditorClassname}
      ref={autoFocusAndSelect}
      value={row[column.key as keyof TRow] as unknown as string}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      onBlur={() => onClose(true, false)}
    />
  );
}

export function editorDate<TRow, TSummaryRow>({ row, column, onRowChange, onClose }: any) {
  return (
    <input
      type="datetime-local"
      className={textEditorClassname}
      ref={autoFocusAndSelect}
      value={row[column.key as keyof TRow] as unknown as string}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      onBlur={() => onClose(true, false)}
    />
  );
}
