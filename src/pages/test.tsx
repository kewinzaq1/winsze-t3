import { Button } from "src/components/common/Button";
import { useNotifier } from "src/components/notifier";

export default function TestPage() {
  const { show } = useNotifier();

  const showSuccess = () => {
    show({
      message: "Success",
      type: "success",
      duration: 2000,
      description: "This is a success message",
      closable: true,
    });
  };

  return (
    <div className="pt-24">
      <h1>Test Page</h1>
      <Button onClick={showSuccess}>Show toast</Button>
    </div>
  );
}
