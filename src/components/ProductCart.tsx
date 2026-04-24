import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
  productName: string;
  productPrice: number;
  qty: number;
  imageUrl: string;
}
function ProductCart({ productName, productPrice, qty, imageUrl }: Props) {
  return (
    <Card className="w-[300px] rounded-2xl shadow-md">
      <CardContent className="space-y-4 p-4">
        <img src={imageUrl} alt="" width={250} height={250} />
        <p className="text-xl">{productName}</p>
        <p className="text-green-400">${productPrice}.00</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button>See more</Button>
      </CardFooter>
    </Card>
  );
}
export default ProductCart;
