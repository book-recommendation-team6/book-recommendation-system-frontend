import React from 'react';


const BookMetadata = React.memo(({ metadata }) => {
  const { author, genre, publisher, publishDate } = metadata;

  const metadataItems = [
    { label: 'Tác giả', value: author },
    { label: 'Thể loại', value: genre },
    { label: 'Nhà xuất bản', value: publisher },
    { label: 'Năm phát hành', value: publishDate },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {metadataItems.map((item, index) => (
        <div key={item.label} className={index < 2 ? 'space-y-4' : ''}>
          <div className="flex">
            <span className={`${index >= 2 ? 'w-36' : 'w-32'} font-semibold text-gray-700`}>
              {item.label}:
            </span>
            <span className="text-gray-600">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

BookMetadata.displayName = 'BookMetadata';
export default BookMetadata;