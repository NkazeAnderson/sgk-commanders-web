import GeneralNavBar from "@/components/navbars/GeneralNavBar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="flex w-full p-10">
        <div className="w-1/2 space-y-4">
          <h4>One Tap. Rapid Response.</h4>
          <h1 className="text-blue-900">SGK Commanders </h1>
          <p className="py-4">
            Cameroon's first rapid security intervention mobile app
          </p>
          <div className=" text-gray-300!">
            <div className="flex items-start  space-x-4 ">
              <p className="inline-block">Send instant SOS alerts</p>
              <Check size={16} className="text-blue-600" />
            </div>
            <div className="flex items-start  space-x-4 ">
              <p className="inline-block">
                Get elite security intervention at your exact location.
              </p>
              <Check size={16} className="text-blue-600" />
            </div>
            <div className="flex items-start  space-x-4 ">
              <p className="inline-block">Get help as soon as you need it.</p>
              <Check size={16} className="text-blue-600" />
            </div>
          </div>

          <div className="py-8 space-y-8">
            <h4 className=" text-blue-200">Download mobile app</h4>
            <div className=" flex gap-10">
              <Button className="bg-blue-700">
                <Image
                  src={"/icons8-android-logo.svg"}
                  width={24}
                  height={24}
                  alt="Android logo"
                />
                Android Play Store
              </Button>
              <Button className="bg-blue-700">
                <Image
                  src={"/icons8-app-store.svg"}
                  width={24}
                  height={24}
                  alt="Iphone app store logo"
                />
                Apple App Store
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-radial from-blue-500 from-10% to-65% to-transparent relative">
          <Image
            fill
            className="w-full h-auto object-contain"
            sizes="100vw"
            src={"/heroImage.png"}
            alt="Hero image"
          />
        </div>
      </section>
    </main>
  );
}
