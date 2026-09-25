import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TopItem } from '@/models/TopItem';
import { Post } from '@/models/Post';
import { Quote } from '@/models/Quote';
import { HeroSlide } from '@/models/HeroSlide';
import { Subscriber } from '@/models/Subscriber';
import {
  defaultTopItems,
  defaultPosts,
  defaultQuotes,
  defaultHeroSlides,
} from '@/lib/defaultData';

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ message: 'Connected in offline mode, no seeding needed.' });
    }

    // Seed Top Items if empty
    const topCount = await TopItem.countDocuments();
    if (topCount === 0) {
      await TopItem.insertMany(
        defaultTopItems.map((item) => ({
          title: item.title,
          meta: item.meta,
          badgeText: item.badgeText,
          badgeColor: item.badgeColor,
          imageUrl: item.imageUrl,
          order: item.order,
        }))
      );
    }

    // Seed Posts if empty
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.insertMany(
        defaultPosts.map((p) => ({
          date: p.date,
          headline: p.headline,
          sub: p.sub,
          thumbUrl: p.thumbUrl,
          isFeatureBadge: p.isFeatureBadge,
          featureText: p.featureText,
          page: p.page,
          order: p.order,
        }))
      );
    }

    // Seed Quotes if empty
    const quoteCount = await Quote.countDocuments();
    if (quoteCount === 0) {
      await Quote.insertMany(
        defaultQuotes.map((q) => ({
          boldText: q.boldText,
          bodyText: q.bodyText,
          tagText: q.tagText,
          caption: q.caption,
          credit: q.credit,
          name: q.name,
          role: q.role,
          avatarUrl: q.avatarUrl,
          bannerUrl: q.bannerUrl,
          isActive: q.isActive,
          order: q.order,
        }))
      );
    }

    // Seed Hero Slides if empty, otherwise update them
    const heroCount = await HeroSlide.countDocuments();
    if (heroCount === 0) {
      await HeroSlide.insertMany(defaultHeroSlides);
    } else {
      await Promise.all(
        defaultHeroSlides.map((hero) =>
          HeroSlide.updateOne(
            { order: hero.order },
            {
              $set: {
                imageUrl: hero.imageUrl,
                mobileImageUrl: hero.mobileImageUrl,
                title: hero.title,
                meta: hero.meta,
                badgeText: hero.badgeText,
                headline: hero.headline,
              },
            },
            { upsert: true }
          )
        )
      );
    }

    // Seed sample subscriber
    const subCount = await Subscriber.countDocuments();
    if (subCount === 0) {
      await Subscriber.create({
        email: 'officialcreanote@gmail.com',
      });
    }

    return NextResponse.json({
      message: 'Database seeded successfully with Creanote initial data',
      counts: {
        topItems: await TopItem.countDocuments(),
        posts: await Post.countDocuments(),
        quotes: await Quote.countDocuments(),
        heroSlides: await HeroSlide.countDocuments(),
        subscribers: await Subscriber.countDocuments(),
      },
    });
  } catch (error: unknown) {
    console.error('Error seeding database:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
