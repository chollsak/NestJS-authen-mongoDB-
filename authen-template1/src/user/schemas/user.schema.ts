import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcrypt';


export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
})

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
      if (ret._id) {
          ret.id = ret._id;
      }
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.refreshToken;
  }
});

