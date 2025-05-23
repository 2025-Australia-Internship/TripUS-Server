import { Injectable, Logger } from '@nestjs/common';
import * as vision from '@google-cloud/vision';
import { LandmarksService } from 'src/landmarks/landmarks.service';
import path from 'path';

@Injectable()
export class VisionService {
  private client: vision.ImageAnnotatorClient;

  constructor(private readonly landmarkService: LandmarksService) {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: path.join(__dirname, process.env.GOOGLE_VISION_PATH),
    });
  }

  private preprocessingName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/[^\w가-힣]/, ''); // 한글, 영어, 숫자, 밑줄로만 구성
  }

  async detectLandmarkFromImage(image: string): Promise<number | null> {
    try {
      const [result] = await this.client.landmarkDetection({
        image: { content: image.replace(/^data:image\/\w+;base64,/, '') },
      });

      const detectedLandmark = result.landmarkAnnotations || []; // Vision이 인식한 랜드마크 목록 또는 []
      console.log('detectedLandmark : ', detectedLandmark);
      if (!detectedLandmark.length || !detectedLandmark[0].description)
        return null;

      const preprocessedName = this.preprocessingName(
        detectedLandmark[0].description,
      );
      const landmarks = await this.landmarkService.find();

      for (const landmark of landmarks) {
        const LandmarksName = this.preprocessingName(landmark.name);
        if (
          LandmarksName.includes(preprocessedName) ||
          preprocessedName.includes(LandmarksName)
        ) {
          return landmark.id;
        }
      }

      return null;
    } catch (err) {
      Logger.error('Vision AI API error : ', err);
      throw err;
    }
  }
}
