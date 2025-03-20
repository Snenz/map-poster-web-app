import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

export default function DesignCard({ design }) {
    return (
        <div className="max-w-xs">
            <AspectRatio ratio={1}>
                <Card className="w-full h-full">
                    <CardContent className="w-full h-full">
                        {design?.image_url ?
                            <Link href={`/designer?design_id=${design.id}`}><Image src={design.image_url} className="w-full h-full object-cover" /></Link>
                            : <Skeleton className="w-full h-full" />
                        }
                    </CardContent>
                </Card>
            </AspectRatio>
        </div>
    );
}