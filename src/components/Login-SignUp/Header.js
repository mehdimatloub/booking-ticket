import React from 'react';
import Link from 'next/link'; // Use next/link for routing in Next.js
import profile from "../../public/profile.png";
import Image from 'next/image';

const Header = ({ heading, paragraph, linkName, linkUrl = "/" }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <Image
          src={profile}
          alt="Profile Image"
          width={400}
          height={200}
          objectFit='contain'
          priority={true}
        />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 mt-5">
        {paragraph}{' '}
        <Link href={linkUrl} className="font-medium text-green-600 hover:text-green-500">
          {linkName}
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600 mt-5">Or</p>
      <p className="mt-2 text-center text-sm text-gray-600 mt-5">
        {'Keep using the web site as an invite ?'}{' '}
        <Link href={'/'} className="font-medium text-green-600 hover:text-green-500">
          {'Home'}
        </Link>
      </p>
    </div>
  );
};
export default Header;