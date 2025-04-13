import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

export default function DesignCard({ design }) {
    return (
        <div className="max-w-xs">
            <Link href={(design ? `/designer?design_id=${design.design_id}` : "#")}>
                <AspectRatio ratio={1}>
                    <Card className="w-full h-full">
                        <CardContent className="w-full h-full">
                            {design ?
                                <Image src={design.preview_img_url} width={400} height={400} alt="Map Design Preview"
                                    className="w-full h-full object-cover" />
                                : <Skeleton className="w-full h-full" />
                            }
                        </CardContent>
                    </Card>
                </AspectRatio>
            </Link>
        </div>
    );
}