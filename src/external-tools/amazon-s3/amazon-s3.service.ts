import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AmazonS3Service {

    constructor(){}


     private readonly s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    async uploadProfilePicture(file: Express.Multer.File, profileId: string){

        const bucket = process.env.S3_BUCKET_NAME!;

        const key = `/user-profile-pictures/${profileId}`;

        await this.s3.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        const imageLink = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return imageLink;
    }
}
