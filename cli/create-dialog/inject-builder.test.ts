import { injectBuilder } from "./inject-builder";

test("inject module in page builder", () => {
  const result = injectBuilder({
    dialogName: "Test",
  });

  expect(
    result.replace(/\s/g, "").includes(
      `{item._type === "dialog.test" && (
        <div>Test</div>
      )}`.replace(/\s/g, ""),
    ),
  ).toBeTruthy();
});
