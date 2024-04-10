import { useState } from "react";
import { auth } from "@/lib/firebase";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Logout } from "./auth/Logout";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const FetchData = () => {
  const [url, setUrl] = useState("http://localhost:4001");
  const [method, setMethod] = useState("GET");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const callNitric = async () => {
    try {
      setLoading(true);
      const idToken = await auth.currentUser?.getIdToken();

      if (idToken) {
        setResult(
          await fetch(`${url}/`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
            method,
          }).then((res) => res.json())
        );
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  return (
    <div className='flex flex-col gap-4 max-w-lg'>
      <div className='grid w-full mx-auto items-center gap-1.5'>
        <Label htmlFor='url'>Enter Endpoint</Label>
        <div className='flex flex-col lg:flex-row gap-1'>
          <Input
            type='url'
            className='w-96 mx-auto'
            id='url'
            placeholder='API Endpoint URL'
            value={url}
            onChange={(evt) => setUrl(evt.target.value)}
          />
          <Select value={method} onValueChange={(value) => setMethod(value)}>
            <SelectTrigger className='w-full lg:w-[100px]'>
              <SelectValue placeholder='Select Method' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Methods</SelectLabel>
                <SelectItem value='GET'>GET</SelectItem>
                <SelectItem value='POST'>POST</SelectItem>
                <SelectItem value='DELETE'>DELETE</SelectItem>
                <SelectItem value='PUT'>PUT</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className='text-sm text-muted-foreground'>
          Change these fields to match your API.
        </p>
      </div>

      <div className='flex gap-4 items-center justify-center mx-auto'>
        <Button disabled={loading} size='lg' type='button' onClick={callNitric}>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {loading ? "Please wait" : "Fetch Data"}
        </Button>
        <Logout />
      </div>
      {result && <pre>{JSON.stringify(result, null, "\t")}</pre>}
    </div>
  );
};

export default FetchData;
