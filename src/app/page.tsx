
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import data from "@/data.json"
import { Card, CardContent ,CardHeader} from "@/components/ui/card"


export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 ,d:px-24 py-12">
      <section className="text-center mb-8 md:mb-12 text-4xl font-semibold">
        <h1 className="text-3l font-bold md:text-5xl " >Mystrey message box </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore mystry box messaage -with us </p>
      </section>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {
            data.map((messaage, index) => (
              <CarouselItem>
                <Card>
                  <CardHeader className="font-bold text-2xl text-center ">{messaage?.title}</CardHeader>
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{messaage?.content}</span>
                    <span className="font-semibold">{messaage?.received}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
